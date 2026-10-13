# Python exam exercises — questions, data, solutions and outputs.
# Run this file directly in Python 3. Each exercise sets its own my_data.

import hashlib
from itertools import product

# Question 1: The answer is the data in uppercase
my_data = 'this class simply rules'

result = my_data.upper()

print(result)
# Output: THIS CLASS SIMPLY RULES

# Question 2: Return the text in data in the reverse order
my_data = 'There is nothing called too much work'

result = my_data[::-1]

print(result)
# Output: krow hcum oot dellac gnihton si erehT

# Question 3: Return the sorted list
my_data = [5, 3, 8, 3, 76, 332, 5, 0, 3]

result = sorted(my_data)

print(result)
# Output: [0, 3, 3, 3, 5, 5, 8, 76, 332]

# Question 4: Return a list containing only the first 3 elements
my_data = [26, 43, 68, 53, 32, 85, 50, 63]

result = my_data[0:3]

print(result)
# Output: [26, 43, 68]

# Question 5: Return a list where each number is multiplied with 5
my_data = [26, 32, 43, 50, 53, 63, 68, 85]

result = []
for n in my_data:
    result.append(n * 5)

print(result)
# Output: [130, 160, 215, 250, 265, 315, 340, 425]

# Question 6: Return the value of the 6th element
my_data = [10, 25, 34, 25, 160, 250, 315]

result = my_data[5]

print(result)
# Output: 250

# Question 7: Return a sorted list, where the duplicates are removed
my_data = [7, 3, 2, 6, 3, 1, 6, 85, 7, 3, 6, 0, 3, 6, 5]

result = sorted(set(my_data))

print(result)
# Output: [0, 1, 2, 3, 5, 6, 7, 85]

# Question 8: Replace 'be' in the data with 'python'
my_data = 'To be, or not to be, that is the question'

result = my_data.replace("be", "python")

print(result)
# Output: To python, or not to python, that is the question

# Question 9: The answer is the whole sentence with the word 'star' spelled backwards
my_data = 'I spend all night staring at the star'

words = my_data.split()
for i in range(len(words)):
    if words[i] == "star":
        words[i] = words[i][::-1]
result = " ".join(words)

print(result)
# Output: I spend all night staring at the rats

# Question 10: Return a list containing 20 values starting with the number in data and incrementing with 5
my_data = 25

result = list(range(my_data, my_data + 100, 5))

print(result)
# Output: [25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110, 115, 120]

# Question 11: The data is a list of tuples containing ip-addresses and number of connections. return the number of connections for ip-address 192.168.1.212
my_data = [('192.168.1.24', 23), ('192.168.1.53', 2), ('192.168.1.212', 34), ('192.168.1.243', 54)]

result = None
for i in my_data:
    if i[0] == "192.168.1.212":
        result = i[1]
        break

print(result)
# Output: 34

# Question 12: The answer is the total sum of all the numbers in the list
my_data = [23, 3413, 4534, 1345, 1, 23, 1434, 112]

result = sum(my_data)

print(result)
# Output: 10885

# Question 13: Return a list containing tuples with names and phonenumbers [("name1","phone1"),("name2","phone2")...]
my_data = 'jens:32242526,peter:23451234,mogens:98768765,lars:98989898,morten:26483277'

result = []
for person in my_data.split(","):
    name, phone = person.split(":")
    result.append((name, phone))

print(result)
# Output: [('jens', '32242526'), ('peter', '23451234'), ('mogens', '98768765'), ('lars', '98989898'),
#  ('morten', '26483277')]

# Question 14: Return the dictionary with the entry for "192.168.1.243" removed
my_data = {'192.168.1.53': 2, '192.168.1.24': 23, '192.168.1.243': 54, '192.168.1.212': 34}

del my_data["192.168.1.243"]
result = my_data

print(result)
# Output: {'192.168.1.53': 2, '192.168.1.24': 23, '192.168.1.212': 34}

# Question 15: The answer is the sentence where each word is in reverese (the words keep their place in the sentence)
my_data = 'When nothing makes sence then have another look'

words = my_data.split()
result = []
for w in words:
    result.append(w[::-1])
result = " ".join(result)

print(result)
# Output: nehW gnihton sekam ecnes neht evah rehtona kool

# Question 16: return a list containing 10 tuples of the ones found in data
my_data = ('x', 'y')

result = [my_data] * 10

print(result)
# Output: [('x', 'y'), ('x', 'y'), ('x', 'y'), ('x', 'y'), ('x', 'y'), ('x', 'y'), ('x', 'y'),
#  ('x', 'y'), ('x', 'y'), ('x', 'y')]

# Question 17: Add a new item to the dictionary with the key "yellow" and the value 22
my_data = {'blue': 32, 'red': 23, 'black': 43, 'green': 76}

my_data["yellow"] = 22
result = my_data

print(result)
# Output: {'blue': 32, 'red': 23, 'black': 43, 'green': 76, 'yellow': 22}

# Question 18: return a set containing all unique ip addresses in data
my_data = """64.242.88.10 - - [08/Mar/2004:10:40:09 -0800] "GET /twiki/bin/view/TWiki/TWikiTopics?rev=r1.7 HTTP/1.1" 200 8540
64.242.88.10 - - [08/Mar/2004:10:45:25 -0800] "GET /twiki/bin/search/Main/SearchResult?scope=text&regex=on&search=Thanadon%20*Somdee[^A-Za-z] HTTP/1.1" 200 4287
64.242.88.10 - - [08/Mar/2004:10:46:34 -0800] "GET /twiki/bin/view/TWiki/TWikiUpgradeTo01May2000?rev=1.3 HTTP/1.1" 200 7441
10.0.0.153 - - [08/Mar/2004:10:48:02 -0800] "GET / HTTP/1.1" 304 -
10.0.0.153 - - [08/Mar/2004:10:48:05 -0800] "GET /cgi-bin/mailgraph2.cgi HTTP/1.1" 200 2987
10.0.0.153 - - [08/Mar/2004:10:48:06 -0800] "GET /cgi-bin/mailgraph.cgi/mailgraph_0_err.png HTTP/1.1" 200 7213
10.0.0.153 - - [08/Mar/2004:10:48:06 -0800] "GET /cgi-bin/mailgraph.cgi/mailgraph_0.png HTTP/1.1" 200 7970
10.2.0.153 - - [08/Mar/2004:10:48:06 -0800] "GET /cgi-bin/mailgraph.cgi/mailgraph_1_err.png HTTP/1.1" 200 7254
10.2.0.153 - - [08/Mar/2004:10:48:06 -0800] "GET /cgi-bin/mailgraph.cgi/mailgraph_1.png HTTP/1.1" 200 8821
10.0.0.153 - - [08/Mar/2004:10:48:06 -0800] "GET /cgi-bin/mailgraph.cgi/mailgraph_2_err.png HTTP/1.1" 200 6866
10.4.0.153 - - [08/Mar/2004:10:48:06 -0800] "GET /cgi-bin/mailgraph.cgi/mailgraph_2.png HTTP/1.1" 200 9312
10.5.0.153 - - [08/Mar/2004:10:48:06 -0800] "GET /cgi-bin/mailgraph.cgi/mailgraph_3.png HTTP/1.1" 200 6596
10.0.0.153 - - [08/Mar/2004:10:48:06 -0800] "GET /cgi-bin/mailgraph.cgi/mailgraph_3_err.png HTTP/1.1" 200 5499
64.22.88.10 - - [08/Mar/2004:10:48:19 -0800] "GET /twiki/bin/edit/Main/Max_use?topicparent=Main.ConfigurationVariables HTTP/1.1" 401 12846
10.0.0.153 - - [08/Mar/2004:10:48:37 -0800] "GET /dccstats/index.html HTTP/1.1" 304 -
10.0.0.153 - - [08/Mar/2004:10:48:37 -0800] "GET /dccstats/stats-spam.1day.png HTTP/1.1" 200 3080
10.0.0.153 - - [08/Mar/2004:10:48:37 -0800] "GET /dccstats/stats-spam-ratio.1day.png HTTP/1.1" 200 2224
10.0.0.153 - - [08/Mar/2004:10:48:37 -0800] "GET /dccstats/stats-spam.1week.png HTTP/1.1" 200 3299
10.0.32.153 - - [08/Mar/2004:10:48:37 -0800] "GET /dccstats/stats-spam.1month.png HTTP/1.1" 200 2481
10.0.32.153 - - [08/Mar/2004:10:48:37 -0800] "GET /dccstats/stats-hashes.1week.png HTTP/1.1" 200 1667
10.0.32.153 - - [08/Mar/2004:10:48:37 -0800] "GET /dccstats/stats-spam-ratio.1week.png HTTP/1.1" 200 2346
10.0.32.153 - - [08/Mar/2004:10:48:37 -0800] "GET /dccstats/stats-spam-ratio.1month.png HTTP/1.1" 200 1872
10.0.0.153 - - [08/Mar/2004:10:48:37 -0800] "GET /dccstats/stats-hashes.1month.png HTTP/1.1" 200 1585
10.0.2.153 - - [08/Mar/2004:10:48:37 -0800] "GET /dccstats/stats-spam.1year.png HTTP/1.1" 200 2202
10.0.0.153 - - [08/Mar/2004:10:48:37 -0800] "GET /dccstats/stats-spam-ratio.1year.png HTTP/1.1" 200 1833
10.0.0.153 - - [08/Mar/2004:10:48:37 -0800] "GET /dccstats/stats-hashes.1year.png HTTP/1.1" 200 1521
64.242.88.10 - - [08/Mar/2004:10:50:05 -0800] "GET /twiki/bin/rdiff/TWiki/WebRss HTTP/1.1" 200 21483
64.242.88.10 - - [08/Mar/2004:11:03:34 -0800] "GET /twiki/bin/rdiff/TWiki/WikiCulture?rev1=1.8&rev2=1.7 HTTP/1.1" 200 5326
128.227.88.79 - - [08/Mar/2004:11:06:20 -0800] "GET /twiki/bin/view/Main/SpamAssassinAndPostFix HTTP/1.1" 200 4034
128.227.88.79 - - [08/Mar/2004:11:06:20 -0800] "GET /twiki/pub/TWiki/TWikiLogos/twikiRobot46x50.gif HTTP/1.1" 304 -
128.227.88.78 - - [08/Mar/2004:11:06:28 -0800] "GET /twiki/bin/view/Main/SpamAssassinTaggingOnly HTTP/1.1" 200 5691
64.242.88.10 - - [08/Mar/2004:11:09:24 -0800] "GET /twiki/bin/edit/Main/Lmtp_mail_timeout?topicparent=Main.ConfigurationVariables HTTP/1.1" 401 12846
128.227.88.79 - - [08/Mar/2004:11:10:09 -0800] "GET /twiki/bin/view/Main/WebHome HTTP/1.1" 200 10419
128.227.88.79 - - [08/Mar/2004:11:10:24 -0800] "GET /twiki/bin/view/Main/PostfixCommands HTTP/1.1" 200 4016
128.227.88.79 - - [08/Mar/2004:11:11:04 -0800] "GET /twiki/bin/view/Main/WebHome HTTP/1.1" 200 10419
128.27.88.79 - - [08/Mar/2004:11:11:10 -0800] "GET /twiki/bin/view/Main/TWikiGroups HTTP/1.1" 200 4816
128.27.88.79 - - [08/Mar/2004:11:11:15 -0800] "GET /twiki/bin/view/Main/TWikiAdminGroup HTTP/1.1" 200 4175
128.27.88.79 - - [08/Mar/2004:11:11:26 -0800] "GET /twiki/bin/view/Main/WebHome HTTP/1.1" 200 10419
64.242.88.10 - - [08/Mar/2004:11:11:51 -0800] "GET /twiki/bin/edit/Main/TWikiGuest?t=1078713282 HTTP/1.1" 401 12846
64.242.88.10 - - [08/Mar/2004:11:15:51 -0800] "GET /twiki/bin/rdiff/TWiki/AdminSkillsAssumptions HTTP/1.1" 200 10368
64.242.88.10 - - [08/Mar/2004:11:17:49 -0800] "GET /twiki/bin/view/Sandbox/WebHome?rev=r1.3 HTTP/1.1" 200 8708
64.242.88.10 - - [08/Mar/2004:11:19:43 -0800] "GET /twiki/bin/edit/TWiki/WikiNotation?t=1078726052 HTTP/1.1" 401 12846
64.242.88.10 - - [08/Mar/2004:11:24:12 -0800] "GET /twiki/bin/search/TWiki/SearchResult?scope=text&regex=on&search=Wiki%20*Notation[^A-Za-z] HTTP/1.1" 200 6558
6.242.88.10 - - [08/Mar/2004:11:25:16 -0800] "GET /twiki/bin/oops/TWiki/WikiNotation?template=oopsmore&param1=1.3&param2=1.3 HTTP/1.1" 200 11263
10.0.0.153 - - [08/Mar/2004:11:40:41 -0800] "GET /cgi-bin/mailgraph2.cgi HTTP/1.1" 200 2987
10.0.0.152 - - [08/Mar/2004:11:40:42 -0800] "GET /cgi-bin/mailgraph.cgi/mailgraph_0_err.png HTTP/1.1" 200 7226
10.0.0.153 - - [08/Mar/2004:11:40:42 -0800] "GET /cgi-bin/mailgraph.cgi/mailgraph_0.png HTTP/1.1" 200 8055
10.0.0.151 - - [08/Mar/2004:11:40:42 -0800] "GET /cgi-bin/mailgraph.cgi/mailgraph_1.png HTTP/1.1" 200 8787"""

result = set()
lines = my_data.split("\n")
for l in lines:
    if l:
        ip = l.split()[0]
        result.add(ip)

print(result)
# Output: {'10.0.0.151', '10.0.0.152', '10.0.0.153', '10.0.2.153', '10.0.32.153', '10.2.0.153', '10.4.0.153', '10.5.0.153', '128.227.88.78', '128.227.88.79', '128.27.88.79', '6.242.88.10', '64.22.88.10', '64.242.88.10'}
# Note: (set order may differ when printed)

# Question 19: return a dictionary containing all status codes (in string)  as key, and how many times their occured (in int) as value
my_data = """64.242.88.10 - - [08/Mar/2004:10:40:09 -0800] "GET /twiki/bin/view/TWiki/TWikiTopics?rev=r1.7 HTTP/1.1" 200 8540
64.242.88.10 - - [08/Mar/2004:10:45:25 -0800] "GET /twiki/bin/search/Main/SearchResult?scope=text&regex=on&search=Thanadon%20*Somdee[^A-Za-z] HTTP/1.1" 200 4287
64.242.88.10 - - [08/Mar/2004:10:46:34 -0800] "GET /twiki/bin/view/TWiki/TWikiUpgradeTo01May2000?rev=1.3 HTTP/1.1" 200 7441
10.0.0.153 - - [08/Mar/2004:10:48:02 -0800] "GET / HTTP/1.1" 304 -
10.0.0.153 - - [08/Mar/2004:10:48:05 -0800] "GET /cgi-bin/mailgraph2.cgi HTTP/1.1" 200 2987
10.0.0.153 - - [08/Mar/2004:10:48:06 -0800] "GET /cgi-bin/mailgraph.cgi/mailgraph_0_err.png HTTP/1.1" 200 7213
10.0.0.153 - - [08/Mar/2004:10:48:06 -0800] "GET /cgi-bin/mailgraph.cgi/mailgraph_0.png HTTP/1.1" 200 7970
10.2.0.153 - - [08/Mar/2004:10:48:06 -0800] "GET /cgi-bin/mailgraph.cgi/mailgraph_1_err.png HTTP/1.1" 200 7254
10.2.0.153 - - [08/Mar/2004:10:48:06 -0800] "GET /cgi-bin/mailgraph.cgi/mailgraph_1.png HTTP/1.1" 200 8821
10.0.0.153 - - [08/Mar/2004:10:48:06 -0800] "GET /cgi-bin/mailgraph.cgi/mailgraph_2_err.png HTTP/1.1" 200 6866
10.4.0.153 - - [08/Mar/2004:10:48:06 -0800] "GET /cgi-bin/mailgraph.cgi/mailgraph_2.png HTTP/1.1" 200 9312
10.5.0.153 - - [08/Mar/2004:10:48:06 -0800] "GET /cgi-bin/mailgraph.cgi/mailgraph_3.png HTTP/1.1" 200 6596
10.0.0.153 - - [08/Mar/2004:10:48:06 -0800] "GET /cgi-bin/mailgraph.cgi/mailgraph_3_err.png HTTP/1.1" 200 5499
64.22.88.10 - - [08/Mar/2004:10:48:19 -0800] "GET /twiki/bin/edit/Main/Max_use?topicparent=Main.ConfigurationVariables HTTP/1.1" 401 12846
10.0.0.153 - - [08/Mar/2004:10:48:37 -0800] "GET /dccstats/index.html HTTP/1.1" 304 -
10.0.0.153 - - [08/Mar/2004:10:48:37 -0800] "GET /dccstats/stats-spam.1day.png HTTP/1.1" 200 3080
10.0.0.153 - - [08/Mar/2004:10:48:37 -0800] "GET /dccstats/stats-spam-ratio.1day.png HTTP/1.1" 200 2224
10.0.0.153 - - [08/Mar/2004:10:48:37 -0800] "GET /dccstats/stats-spam.1week.png HTTP/1.1" 200 3299
10.0.32.153 - - [08/Mar/2004:10:48:37 -0800] "GET /dccstats/stats-spam.1month.png HTTP/1.1" 200 2481
10.0.32.153 - - [08/Mar/2004:10:48:37 -0800] "GET /dccstats/stats-hashes.1week.png HTTP/1.1" 200 1667
10.0.32.153 - - [08/Mar/2004:10:48:37 -0800] "GET /dccstats/stats-spam-ratio.1week.png HTTP/1.1" 200 2346
10.0.32.153 - - [08/Mar/2004:10:48:37 -0800] "GET /dccstats/stats-spam-ratio.1month.png HTTP/1.1" 200 1872
10.0.0.153 - - [08/Mar/2004:10:48:37 -0800] "GET /dccstats/stats-hashes.1month.png HTTP/1.1" 200 1585
10.0.2.153 - - [08/Mar/2004:10:48:37 -0800] "GET /dccstats/stats-spam.1year.png HTTP/1.1" 200 2202
10.0.0.153 - - [08/Mar/2004:10:48:37 -0800] "GET /dccstats/stats-spam-ratio.1year.png HTTP/1.1" 200 1833
10.0.0.153 - - [08/Mar/2004:10:48:37 -0800] "GET /dccstats/stats-hashes.1year.png HTTP/1.1" 200 1521
64.242.88.10 - - [08/Mar/2004:10:50:05 -0800] "GET /twiki/bin/rdiff/TWiki/WebRss HTTP/1.1" 200 21483
64.242.88.10 - - [08/Mar/2004:11:03:34 -0800] "GET /twiki/bin/rdiff/TWiki/WikiCulture?rev1=1.8&rev2=1.7 HTTP/1.1" 200 5326
128.227.88.79 - - [08/Mar/2004:11:06:20 -0800] "GET /twiki/bin/view/Main/SpamAssassinAndPostFix HTTP/1.1" 200 4034
128.227.88.79 - - [08/Mar/2004:11:06:20 -0800] "GET /twiki/pub/TWiki/TWikiLogos/twikiRobot46x50.gif HTTP/1.1" 304 -
128.227.88.78 - - [08/Mar/2004:11:06:28 -0800] "GET /twiki/bin/view/Main/SpamAssassinTaggingOnly HTTP/1.1" 200 5691
64.242.88.10 - - [08/Mar/2004:11:09:24 -0800] "GET /twiki/bin/edit/Main/Lmtp_mail_timeout?topicparent=Main.ConfigurationVariables HTTP/1.1" 401 12846
128.227.88.79 - - [08/Mar/2004:11:10:09 -0800] "GET /twiki/bin/view/Main/WebHome HTTP/1.1" 200 10419
128.227.88.79 - - [08/Mar/2004:11:10:24 -0800] "GET /twiki/bin/view/Main/PostfixCommands HTTP/1.1" 200 4016
128.227.88.79 - - [08/Mar/2004:11:11:04 -0800] "GET /twiki/bin/view/Main/WebHome HTTP/1.1" 200 10419
128.27.88.79 - - [08/Mar/2004:11:11:10 -0800] "GET /twiki/bin/view/Main/TWikiGroups HTTP/1.1" 200 4816
128.27.88.79 - - [08/Mar/2004:11:11:15 -0800] "GET /twiki/bin/view/Main/TWikiAdminGroup HTTP/1.1" 200 4175
128.27.88.79 - - [08/Mar/2004:11:11:26 -0800] "GET /twiki/bin/view/Main/WebHome HTTP/1.1" 200 10419
64.242.88.10 - - [08/Mar/2004:11:11:51 -0800] "GET /twiki/bin/edit/Main/TWikiGuest?t=1078713282 HTTP/1.1" 401 12846
64.242.88.10 - - [08/Mar/2004:11:15:51 -0800] "GET /twiki/bin/rdiff/TWiki/AdminSkillsAssumptions HTTP/1.1" 200 10368
64.242.88.10 - - [08/Mar/2004:11:17:49 -0800] "GET /twiki/bin/view/Sandbox/WebHome?rev=r1.3 HTTP/1.1" 200 8708
64.242.88.10 - - [08/Mar/2004:11:19:43 -0800] "GET /twiki/bin/edit/TWiki/WikiNotation?t=1078726052 HTTP/1.1" 401 12846
64.242.88.10 - - [08/Mar/2004:11:24:12 -0800] "GET /twiki/bin/search/TWiki/SearchResult?scope=text&regex=on&search=Wiki%20*Notation[^A-Za-z] HTTP/1.1" 200 6558
6.242.88.10 - - [08/Mar/2004:11:25:16 -0800] "GET /twiki/bin/oops/TWiki/WikiNotation?template=oopsmore&param1=1.3&param2=1.3 HTTP/1.1" 200 11263
10.0.0.153 - - [08/Mar/2004:11:40:41 -0800] "GET /cgi-bin/mailgraph2.cgi HTTP/1.1" 200 2987
10.0.0.152 - - [08/Mar/2004:11:40:42 -0800] "GET /cgi-bin/mailgraph.cgi/mailgraph_0_err.png HTTP/1.1" 200 7226
10.0.0.153 - - [08/Mar/2004:11:40:42 -0800] "GET /cgi-bin/mailgraph.cgi/mailgraph_0.png HTTP/1.1" 200 8055
10.0.0.151 - - [08/Mar/2004:11:40:42 -0800] "GET /cgi-bin/mailgraph.cgi/mailgraph_1.png HTTP/1.1" 200 8787"""

result = {}
for line in my_data.split("\n"):
    if line:
        parts = line.split('"')[2].split()
        status = parts[0]
        if status in result:
            result[status] += 1
        else:
            result[status] = 1

print(result)
# Output: {'200': 41, '304': 3, '401': 4}

# Question 20: return the average size (in int) of all responses with status 200
my_data = """64.242.88.10 - - [08/Mar/2004:10:40:09 -0800] "GET /twiki/bin/view/TWiki/TWikiTopics?rev=r1.7 HTTP/1.1" 200 8540
64.242.88.10 - - [08/Mar/2004:10:45:25 -0800] "GET /twiki/bin/search/Main/SearchResult?scope=text&regex=on&search=Thanadon%20*Somdee[^A-Za-z] HTTP/1.1" 200 4287
64.242.88.10 - - [08/Mar/2004:10:46:34 -0800] "GET /twiki/bin/view/TWiki/TWikiUpgradeTo01May2000?rev=1.3 HTTP/1.1" 200 7441
10.0.0.153 - - [08/Mar/2004:10:48:02 -0800] "GET / HTTP/1.1" 304 -
10.0.0.153 - - [08/Mar/2004:10:48:05 -0800] "GET /cgi-bin/mailgraph2.cgi HTTP/1.1" 200 2987
10.0.0.153 - - [08/Mar/2004:10:48:06 -0800] "GET /cgi-bin/mailgraph.cgi/mailgraph_0_err.png HTTP/1.1" 200 7213
10.0.0.153 - - [08/Mar/2004:10:48:06 -0800] "GET /cgi-bin/mailgraph.cgi/mailgraph_0.png HTTP/1.1" 200 7970
10.2.0.153 - - [08/Mar/2004:10:48:06 -0800] "GET /cgi-bin/mailgraph.cgi/mailgraph_1_err.png HTTP/1.1" 200 7254
10.2.0.153 - - [08/Mar/2004:10:48:06 -0800] "GET /cgi-bin/mailgraph.cgi/mailgraph_1.png HTTP/1.1" 200 8821
10.0.0.153 - - [08/Mar/2004:10:48:06 -0800] "GET /cgi-bin/mailgraph.cgi/mailgraph_2_err.png HTTP/1.1" 200 6866
10.4.0.153 - - [08/Mar/2004:10:48:06 -0800] "GET /cgi-bin/mailgraph.cgi/mailgraph_2.png HTTP/1.1" 200 9312
10.5.0.153 - - [08/Mar/2004:10:48:06 -0800] "GET /cgi-bin/mailgraph.cgi/mailgraph_3.png HTTP/1.1" 200 6596
10.0.0.153 - - [08/Mar/2004:10:48:06 -0800] "GET /cgi-bin/mailgraph.cgi/mailgraph_3_err.png HTTP/1.1" 200 5499
64.22.88.10 - - [08/Mar/2004:10:48:19 -0800] "GET /twiki/bin/edit/Main/Max_use?topicparent=Main.ConfigurationVariables HTTP/1.1" 401 12846
10.0.0.153 - - [08/Mar/2004:10:48:37 -0800] "GET /dccstats/index.html HTTP/1.1" 304 -
10.0.0.153 - - [08/Mar/2004:10:48:37 -0800] "GET /dccstats/stats-spam.1day.png HTTP/1.1" 200 3080
10.0.0.153 - - [08/Mar/2004:10:48:37 -0800] "GET /dccstats/stats-spam-ratio.1day.png HTTP/1.1" 200 2224
10.0.0.153 - - [08/Mar/2004:10:48:37 -0800] "GET /dccstats/stats-spam.1week.png HTTP/1.1" 200 3299
10.0.32.153 - - [08/Mar/2004:10:48:37 -0800] "GET /dccstats/stats-spam.1month.png HTTP/1.1" 200 2481
10.0.32.153 - - [08/Mar/2004:10:48:37 -0800] "GET /dccstats/stats-hashes.1week.png HTTP/1.1" 200 1667
10.0.32.153 - - [08/Mar/2004:10:48:37 -0800] "GET /dccstats/stats-spam-ratio.1week.png HTTP/1.1" 200 2346
10.0.32.153 - - [08/Mar/2004:10:48:37 -0800] "GET /dccstats/stats-spam-ratio.1month.png HTTP/1.1" 200 1872
10.0.0.153 - - [08/Mar/2004:10:48:37 -0800] "GET /dccstats/stats-hashes.1month.png HTTP/1.1" 200 1585
10.0.2.153 - - [08/Mar/2004:10:48:37 -0800] "GET /dccstats/stats-spam.1year.png HTTP/1.1" 200 2202
10.0.0.153 - - [08/Mar/2004:10:48:37 -0800] "GET /dccstats/stats-spam-ratio.1year.png HTTP/1.1" 200 1833
10.0.0.153 - - [08/Mar/2004:10:48:37 -0800] "GET /dccstats/stats-hashes.1year.png HTTP/1.1" 200 1521
64.242.88.10 - - [08/Mar/2004:10:50:05 -0800] "GET /twiki/bin/rdiff/TWiki/WebRss HTTP/1.1" 200 21483
64.242.88.10 - - [08/Mar/2004:11:03:34 -0800] "GET /twiki/bin/rdiff/TWiki/WikiCulture?rev1=1.8&rev2=1.7 HTTP/1.1" 200 5326
128.227.88.79 - - [08/Mar/2004:11:06:20 -0800] "GET /twiki/bin/view/Main/SpamAssassinAndPostFix HTTP/1.1" 200 4034
128.227.88.79 - - [08/Mar/2004:11:06:20 -0800] "GET /twiki/pub/TWiki/TWikiLogos/twikiRobot46x50.gif HTTP/1.1" 304 -
128.227.88.78 - - [08/Mar/2004:11:06:28 -0800] "GET /twiki/bin/view/Main/SpamAssassinTaggingOnly HTTP/1.1" 200 5691
64.242.88.10 - - [08/Mar/2004:11:09:24 -0800] "GET /twiki/bin/edit/Main/Lmtp_mail_timeout?topicparent=Main.ConfigurationVariables HTTP/1.1" 401 12846
128.227.88.79 - - [08/Mar/2004:11:10:09 -0800] "GET /twiki/bin/view/Main/WebHome HTTP/1.1" 200 10419
128.227.88.79 - - [08/Mar/2004:11:10:24 -0800] "GET /twiki/bin/view/Main/PostfixCommands HTTP/1.1" 200 4016
128.227.88.79 - - [08/Mar/2004:11:11:04 -0800] "GET /twiki/bin/view/Main/WebHome HTTP/1.1" 200 10419
128.27.88.79 - - [08/Mar/2004:11:11:10 -0800] "GET /twiki/bin/view/Main/TWikiGroups HTTP/1.1" 200 4816
128.27.88.79 - - [08/Mar/2004:11:11:15 -0800] "GET /twiki/bin/view/Main/TWikiAdminGroup HTTP/1.1" 200 4175
128.27.88.79 - - [08/Mar/2004:11:11:26 -0800] "GET /twiki/bin/view/Main/WebHome HTTP/1.1" 200 10419
64.242.88.10 - - [08/Mar/2004:11:11:51 -0800] "GET /twiki/bin/edit/Main/TWikiGuest?t=1078713282 HTTP/1.1" 401 12846
64.242.88.10 - - [08/Mar/2004:11:15:51 -0800] "GET /twiki/bin/rdiff/TWiki/AdminSkillsAssumptions HTTP/1.1" 200 10368
64.242.88.10 - - [08/Mar/2004:11:17:49 -0800] "GET /twiki/bin/view/Sandbox/WebHome?rev=r1.3 HTTP/1.1" 200 8708
64.242.88.10 - - [08/Mar/2004:11:19:43 -0800] "GET /twiki/bin/edit/TWiki/WikiNotation?t=1078726052 HTTP/1.1" 401 12846
64.242.88.10 - - [08/Mar/2004:11:24:12 -0800] "GET /twiki/bin/search/TWiki/SearchResult?scope=text&regex=on&search=Wiki%20*Notation[^A-Za-z] HTTP/1.1" 200 6558
6.242.88.10 - - [08/Mar/2004:11:25:16 -0800] "GET /twiki/bin/oops/TWiki/WikiNotation?template=oopsmore&param1=1.3&param2=1.3 HTTP/1.1" 200 11263
10.0.0.153 - - [08/Mar/2004:11:40:41 -0800] "GET /cgi-bin/mailgraph2.cgi HTTP/1.1" 200 2987
10.0.0.152 - - [08/Mar/2004:11:40:42 -0800] "GET /cgi-bin/mailgraph.cgi/mailgraph_0_err.png HTTP/1.1" 200 7226
10.0.0.153 - - [08/Mar/2004:11:40:42 -0800] "GET /cgi-bin/mailgraph.cgi/mailgraph_0.png HTTP/1.1" 200 8055
10.0.0.151 - - [08/Mar/2004:11:40:42 -0800] "GET /cgi-bin/mailgraph.cgi/mailgraph_1.png HTTP/1.1" 200 8787"""

total = 0
count = 0
for l in my_data.split("\n"):
    if l:
        parts = l.split('"')[2].split()
        status = parts[0]
        if status == "200":
            size = int(parts[1])
            total += size
            count += 1
result = int(total / count)

print(result)
# Output: 6137

# Question 21: return the number of times (in int)  an images of the type png is in the response
my_data = """64.242.88.10 - - [08/Mar/2004:10:40:09 -0800] "GET /twiki/bin/view/TWiki/TWikiTopics?rev=r1.7 HTTP/1.1" 200 8540
64.242.88.10 - - [08/Mar/2004:10:45:25 -0800] "GET /twiki/bin/search/Main/SearchResult?scope=text&regex=on&search=Thanadon%20*Somdee[^A-Za-z] HTTP/1.1" 200 4287
64.242.88.10 - - [08/Mar/2004:10:46:34 -0800] "GET /twiki/bin/view/TWiki/TWikiUpgradeTo01May2000?rev=1.3 HTTP/1.1" 200 7441
10.0.0.153 - - [08/Mar/2004:10:48:02 -0800] "GET / HTTP/1.1" 304 -
10.0.0.153 - - [08/Mar/2004:10:48:05 -0800] "GET /cgi-bin/mailgraph2.cgi HTTP/1.1" 200 2987
10.0.0.153 - - [08/Mar/2004:10:48:06 -0800] "GET /cgi-bin/mailgraph.cgi/mailgraph_0_err.png HTTP/1.1" 200 7213
10.0.0.153 - - [08/Mar/2004:10:48:06 -0800] "GET /cgi-bin/mailgraph.cgi/mailgraph_0.png HTTP/1.1" 200 7970
10.2.0.153 - - [08/Mar/2004:10:48:06 -0800] "GET /cgi-bin/mailgraph.cgi/mailgraph_1_err.png HTTP/1.1" 200 7254
10.2.0.153 - - [08/Mar/2004:10:48:06 -0800] "GET /cgi-bin/mailgraph.cgi/mailgraph_1.png HTTP/1.1" 200 8821
10.0.0.153 - - [08/Mar/2004:10:48:06 -0800] "GET /cgi-bin/mailgraph.cgi/mailgraph_2_err.png HTTP/1.1" 200 6866
10.4.0.153 - - [08/Mar/2004:10:48:06 -0800] "GET /cgi-bin/mailgraph.cgi/mailgraph_2.png HTTP/1.1" 200 9312
10.5.0.153 - - [08/Mar/2004:10:48:06 -0800] "GET /cgi-bin/mailgraph.cgi/mailgraph_3.png HTTP/1.1" 200 6596
10.0.0.153 - - [08/Mar/2004:10:48:06 -0800] "GET /cgi-bin/mailgraph.cgi/mailgraph_3_err.png HTTP/1.1" 200 5499
64.22.88.10 - - [08/Mar/2004:10:48:19 -0800] "GET /twiki/bin/edit/Main/Max_use?topicparent=Main.ConfigurationVariables HTTP/1.1" 401 12846
10.0.0.153 - - [08/Mar/2004:10:48:37 -0800] "GET /dccstats/index.html HTTP/1.1" 304 -
10.0.0.153 - - [08/Mar/2004:10:48:37 -0800] "GET /dccstats/stats-spam.1day.png HTTP/1.1" 200 3080
10.0.0.153 - - [08/Mar/2004:10:48:37 -0800] "GET /dccstats/stats-spam-ratio.1day.png HTTP/1.1" 200 2224
10.0.0.153 - - [08/Mar/2004:10:48:37 -0800] "GET /dccstats/stats-spam.1week.png HTTP/1.1" 200 3299
10.0.32.153 - - [08/Mar/2004:10:48:37 -0800] "GET /dccstats/stats-spam.1month.png HTTP/1.1" 200 2481
10.0.32.153 - - [08/Mar/2004:10:48:37 -0800] "GET /dccstats/stats-hashes.1week.png HTTP/1.1" 200 1667
10.0.32.153 - - [08/Mar/2004:10:48:37 -0800] "GET /dccstats/stats-spam-ratio.1week.png HTTP/1.1" 200 2346
10.0.32.153 - - [08/Mar/2004:10:48:37 -0800] "GET /dccstats/stats-spam-ratio.1month.png HTTP/1.1" 200 1872
10.0.0.153 - - [08/Mar/2004:10:48:37 -0800] "GET /dccstats/stats-hashes.1month.png HTTP/1.1" 200 1585
10.0.2.153 - - [08/Mar/2004:10:48:37 -0800] "GET /dccstats/stats-spam.1year.png HTTP/1.1" 200 2202
10.0.0.153 - - [08/Mar/2004:10:48:37 -0800] "GET /dccstats/stats-spam-ratio.1year.png HTTP/1.1" 200 1833
10.0.0.153 - - [08/Mar/2004:10:48:37 -0800] "GET /dccstats/stats-hashes.1year.png HTTP/1.1" 200 1521
64.242.88.10 - - [08/Mar/2004:10:50:05 -0800] "GET /twiki/bin/rdiff/TWiki/WebRss HTTP/1.1" 200 21483
64.242.88.10 - - [08/Mar/2004:11:03:34 -0800] "GET /twiki/bin/rdiff/TWiki/WikiCulture?rev1=1.8&rev2=1.7 HTTP/1.1" 200 5326
128.227.88.79 - - [08/Mar/2004:11:06:20 -0800] "GET /twiki/bin/view/Main/SpamAssassinAndPostFix HTTP/1.1" 200 4034
128.227.88.79 - - [08/Mar/2004:11:06:20 -0800] "GET /twiki/pub/TWiki/TWikiLogos/twikiRobot46x50.gif HTTP/1.1" 304 -
128.227.88.78 - - [08/Mar/2004:11:06:28 -0800] "GET /twiki/bin/view/Main/SpamAssassinTaggingOnly HTTP/1.1" 200 5691
64.242.88.10 - - [08/Mar/2004:11:09:24 -0800] "GET /twiki/bin/edit/Main/Lmtp_mail_timeout?topicparent=Main.ConfigurationVariables HTTP/1.1" 401 12846
128.227.88.79 - - [08/Mar/2004:11:10:09 -0800] "GET /twiki/bin/view/Main/WebHome HTTP/1.1" 200 10419
128.227.88.79 - - [08/Mar/2004:11:10:24 -0800] "GET /twiki/bin/view/Main/PostfixCommands HTTP/1.1" 200 4016
128.227.88.79 - - [08/Mar/2004:11:11:04 -0800] "GET /twiki/bin/view/Main/WebHome HTTP/1.1" 200 10419
128.27.88.79 - - [08/Mar/2004:11:11:10 -0800] "GET /twiki/bin/view/Main/TWikiGroups HTTP/1.1" 200 4816
128.27.88.79 - - [08/Mar/2004:11:11:15 -0800] "GET /twiki/bin/view/Main/TWikiAdminGroup HTTP/1.1" 200 4175
128.27.88.79 - - [08/Mar/2004:11:11:26 -0800] "GET /twiki/bin/view/Main/WebHome HTTP/1.1" 200 10419
64.242.88.10 - - [08/Mar/2004:11:11:51 -0800] "GET /twiki/bin/edit/Main/TWikiGuest?t=1078713282 HTTP/1.1" 401 12846
64.242.88.10 - - [08/Mar/2004:11:15:51 -0800] "GET /twiki/bin/rdiff/TWiki/AdminSkillsAssumptions HTTP/1.1" 200 10368
64.242.88.10 - - [08/Mar/2004:11:17:49 -0800] "GET /twiki/bin/view/Sandbox/WebHome?rev=r1.3 HTTP/1.1" 200 8708
64.242.88.10 - - [08/Mar/2004:11:19:43 -0800] "GET /twiki/bin/edit/TWiki/WikiNotation?t=1078726052 HTTP/1.1" 401 12846
64.242.88.10 - - [08/Mar/2004:11:24:12 -0800] "GET /twiki/bin/search/TWiki/SearchResult?scope=text&regex=on&search=Wiki%20*Notation[^A-Za-z] HTTP/1.1" 200 6558
6.242.88.10 - - [08/Mar/2004:11:25:16 -0800] "GET /twiki/bin/oops/TWiki/WikiNotation?template=oopsmore&param1=1.3&param2=1.3 HTTP/1.1" 200 11263
10.0.0.153 - - [08/Mar/2004:11:40:41 -0800] "GET /cgi-bin/mailgraph2.cgi HTTP/1.1" 200 2987
10.0.0.152 - - [08/Mar/2004:11:40:42 -0800] "GET /cgi-bin/mailgraph.cgi/mailgraph_0_err.png HTTP/1.1" 200 7226
10.0.0.153 - - [08/Mar/2004:11:40:42 -0800] "GET /cgi-bin/mailgraph.cgi/mailgraph_0.png HTTP/1.1" 200 8055
10.0.0.151 - - [08/Mar/2004:11:40:42 -0800] "GET /cgi-bin/mailgraph.cgi/mailgraph_1.png HTTP/1.1" 200 8787"""

result = my_data.count(".png")

print(result)
# Output: 22

# Question 22: convert this list to a dictionary where the episode number is the key (ie: "Episode I") and the name is the value (ie: "The Phantom Menace")
my_data = [('The Phantom Menace', 'Episode I'), ('Attack of the Clones', 'Episode II'),
 ('Revenge of the Sith', 'Episode III'), ('A New Hope', 'Episode IV'),
 ('The Empire Strikes Back', 'Episode V'), ('Return of the Jedi', 'Episode VI'),
 ('The Force Awakens', 'Episode VII'), ('The Last Jedi', 'Episode VIII'),
 ('The Rise of Skywalker', 'Episode IX')]

result = {}
for name, episode in my_data:
    result[episode] = name

print(result)
# Output: {'Episode I': 'The Phantom Menace',
#  'Episode II': 'Attack of the Clones',
#  'Episode III': 'Revenge of the Sith',
#  'Episode IV': 'A New Hope',
#  'Episode V': 'The Empire Strikes Back',
#  'Episode VI': 'Return of the Jedi',
#  'Episode VII': 'The Force Awakens',
#  'Episode VIII': 'The Last Jedi',
#  'Episode IX': 'The Rise of Skywalker'}

# Question 23: return a sorted list (in int) containing the numbers 1-100, but without the numbers divideble with the number in data (ie. the numbers 3,6,9,12... should not be there)
my_data = 3

result = []
for n in range(1, 101):
    if n % my_data != 0:
        result.append(n)

print(result)
# Output: [1, 2, 4, 5, 7, 8, 10, 11, 13, 14, 16, 17, 19, 20, 22, 23, 25, 26, 28, 29, 31, 32, 34, 35, 37,
#  38, 40, 41, 43, 44, 46, 47, 49, 50, 52, 53, 55, 56, 58, 59, 61, 62, 64, 65, 67, 68, 70, 71,
#  73, 74, 76, 77, 79, 80, 82, 83, 85, 86, 88, 89, 91, 92, 94, 95, 97, 98, 100]

# Question 24: this sha1 hash was found. the system it comes from normally uses 4 character kodes, consisting of a-z in lowercase
my_data = '81976bcf73b15bcb269b92f2f6b66867b9b804c6'

result = None
for letters in product("abcdefghijklmnopqrstuvwxyz", repeat=4):
    guess = "".join(letters)
    if hashlib.sha1(guess.encode()).hexdigest() == my_data:
        result = guess
        break

print(result)
# Output: funi

# Question 25: the data provided contains a tuple, where first element is a sha256. The second element contains a dictionary (created by scapping the victims facebook) of words an values that the password could be generated from. Assume that the password length is 8 characters, and that the system requires lowercase, uppercase letters and numbers.
my_data = ('0ba128bd856006948e7c57b714586bf43199aa898cc2bcd25141d951a34664a8',
 [('Lars', 'Hansen', '05', '09', '1984'), 'fido', ('jan', '08', '08', '2014'),
  ('barcelona', 'fodbold')])

# Combine the first two letters of each name with the year.
result = my_data[1][0][0][:2] + my_data[1][0][1][:2] + my_data[1][2][3]
if hashlib.sha256(result.encode()).hexdigest() != my_data[0]:
    result = None

print(result)
# Output: LaHa2014

# Question 26: return the missing layer
my_data = 'application, transport, link, physical'

result = "network"

print(result)
# Output: network

# Question 27: return the mac address
my_data = '192.168.1.101,  a4::67:06:8d:83:a1, a4:67:06:8d:a1, a4:67:06:8d:83:a1, ff02::fb'

result = None
for address in my_data.split(","):
    address = address.strip()
    parts = address.split(":")
    if len(parts) == 6 and all(len(p) == 2 for p in parts):
        result = address
        break

print(result)
# Output: a4:67:06:8d:83:a1

# Question 28: Use cap.pcapng from the network challenge. Analyse the paket(data is the packet no). What is the length of the data transmitted in this paket (in bytes).
my_data = '2020'

# The packet capture was not provided; this is your supplied answer.
result = 39

print(result)
# Output: 39

# Question 29: Use cap.pcapng from the network challenge. Data is a path for a HTTP request. What is Ack no (raw) in the packet that acknowledges this file?
my_data = '/style.css'

# The packet capture was not provided; this is your supplied answer.
result = 3775708311

print(result)
# Output: 3775708311

# Question 30: Use cap.pcapng from the network challenge. What domain name is here?
my_data = '74.125.143.189'

# The packet capture was not provided; this is your supplied answer.
result = "0.client-channel.google.com"

print(result)
# Output: 0.client-channel.google.com

# Question 31: KEA has been infiltrated by thieves. Luckily, they were chased away, and dropped what they stole.
# Your task is to use the recorded log data to figure out what floor and room number the thieves ended up.
# ServiceDesk gave you the following legend: ^ = +1 floor, v = -1 floor, < = -1 room number, > = +1 room number.
# Answer with a tuple containing the floor and room number, considering you start on floor 0 and room 0.
my_data = '^^^>v^<<v><vv>><>>><^>><>>v>^v^><>v<^^<vv<v^v^>>^^v^>^<v^<<v<<^^v^<>^^^v<<>v><<^>>^v><v>>vv><>^^vvv^>^v><^<><v>vvv^<>v^><v^><^vv<>^v^v>v>v><^>v^vv>v<<vv<'

floor = 0
room = 0
for direction in my_data:
    if direction == "^":
        floor += 1
    elif direction == "v":
        floor -= 1
    elif direction == "<":
        room -= 1
    elif direction == ">":
        room += 1
result = (floor, room)

print(result)
# Output: (-6, 7)

# Question 32: ServiceDesk calls you and tells you they gave you an outdated legend for the log data.
# It was from before KEA realised that having negative room numbers doesn't make sense.
# That means the room numbers wrap back around. For example if you are by room 0 and you move left (<), you will be by room 100 and vice versa.
# Furthermore the legend states that if log entries are repeated, they increment in value.
# For example if you see >>>, the first ">" is 1, the next ">" is 2, and the last ">" is 3, totalling 6 rooms moved.
# This incremenation resets if the current log entry differs from the previous entry.
my_data = '^^^>v^<<v><vv>><>>><^>><>>v>^v^><>v<^^<vv<v^v^>>^^v^>^<v^<<v<<^^v^<>^^^v<<>v><<^>>^v><v>>vv><>^^vvv^>^v><^<><v>vvv^<>v^><v^><^vv<>^v^v>v>v><^>v^vv>v<<vv<'

floor = 0
room = 0
previous = ""
repeat = 0
for direction in my_data:
    if direction == previous:
        repeat += 1
    else:
        repeat = 1
    if direction == "^":
        floor += repeat
    elif direction == "v":
        floor -= repeat
    elif direction == "<":
        room = (room - repeat) % 101
    elif direction == ">":
        room = (room + repeat) % 101
    previous = direction
result = (floor, room)

print(result)
# Output: (-8, 10)

# Question 33: The answer is the data multiplied with 2
my_data = 16

result = my_data * 2

print(result)
# Output: 32

